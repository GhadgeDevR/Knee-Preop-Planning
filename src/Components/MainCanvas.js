import React, { Component } from 'react';
import * as THREE from "three";

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

var	orbitControls;
var	transformControl;
var	objects = [];
var	line;
var	plane;
var	plane_2;
var mesh1,mesh2;

class CanvasHome extends Component {
	//Local variable declaration

	//Code
	constructor(props) {
		super(props);
		this.scene		=	null;
		this.camera		=	null;
		this.renderer	=	null;
		this.cube		=	null;
		this.light		=	null;
		this.frameId	=	null;

		//Variables
		this.Right_FemurModel	=	null;
		this.Right_TibiaModel	=	null;

		this.landmark_femurCentre		=	null;
		this.landmark_hipCenter		=	null;
		this.points			=	[];
		this.raycaster		=	null;
		this.pointer		=	null;
		this.WNDSIZE		=	{ width:0, height: 0};

		this.state	=	{
			showClipping	:	true
		};
	};

	componentDidMount() {
		//Init
		this.initialize();
	};

	componentDidUpdate() {
		//Resize
		window.addEventListener("resize", this.resizeWindow, false)
	}

	componentWillUnmount() {
		this.stop();
	};

	//Initialize App
	initialize = () => {
		//Scene
		this.scene = new THREE.Scene();

		this.WNDSIZE.width	=	this.mount.clientWidth;
		this.WNDSIZE.height	=	this.mount.clientHeight;

		this.renderer	=	new THREE.WebGLRenderer({
			antialias				:	true,
			alpha					:	true,
			preserveDrawingBuffer	:	true
		});

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setClearColor("#e7e7e7", 1);
		this.renderer.setSize(this.WNDSIZE.width, this.WNDSIZE.height);
		this.mount.appendChild(this.renderer.domElement);

		//Setting up camera
		this.setupCamera();

		//Load Model
		this.loadModel();

		//light
		this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		this.scene.add(this.light);
		
		//Setting up raycaster
		this.setupRaycaster();

		//Draw Geomtries
		this.draw();

		//Draw scene
		this.renderScene();

		//Start Animation
		this.start();

		window.addEventListener('keydown', this.keyDown);
		//Handle Resize
		window.addEventListener('click', this.onPointerMove);

		//Warm-up resize call
		window.addEventListener("resize", this.resizeWindow, false);

		//Clear color
		this.renderer.setClearColor("white");
	};

	keyDown = (event) =>{
		//code
		switch(event.keyCode)
		{
			case 70:	//F or f
				if(this.landmark_hipCenter){
					console.log("-----x ",this.landmark_hipCenter.position);
				
				}
		

				break;

			case 72:	//H or h
				break;

			default:
				break;
		}
	}
	
	//Setting up camera
	setupCamera = () => {
		//Code
		this.camera				=	new THREE.PerspectiveCamera(75 , (this.WNDSIZE.width/this.WNDSIZE.height), 0.1, 1000);

		this.camera.position.set(
			-79.72404267414048, 
			66.6783789329992,
			180.89629390488778);

		// this.camera.quaternion.set();
		this.camera.lookAt(this.scene.position);

		orbitControls	=	new OrbitControls(this.camera, this.renderer.domElement);

		transformControl	=	new TransformControls(this.camera, this.renderer.domElement);
		transformControl.setMode('translate');

		transformControl.addEventListener('dragging-changed', function (event) {
			if (line != null) {
				line.visible		=	false;
				plane.visible		=	false;
				plane_2.visible		=	false;
			}
			orbitControls.enabled = !event.value;
		});

		this.scene.add(transformControl);
	};

	//Load Model
	loadModel = () => {
		//Local variable declaration
		const loader	=	new STLLoader();

		//Model1 
		this.Right_FemurModel	=	loader.load('./Right_Femur.stl', ( geometry ) => {
			const material	=	new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
			mesh2	=	new THREE.Mesh( geometry, material );

			mesh2.position.set( 0, -100, 0);
			mesh2.rotation.set(-(Math.PI / 2), 0, 0);
			mesh2.scale.set( 0.18, 0.18, 0.18 );


			mesh2.name = "Right_Femur_Bone";

			objects.push(mesh2);

			this.scene.add( mesh2 );
		});
		// this.Right_FemurModel.rotation.set((Math.PI /2),0,0);
		//Model2
		this.Right_TibiaModel	=	loader.load('./Right_Tibia.stl', ( geometry ) => {
			const material	=	new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
			 mesh1	=	new THREE.Mesh( geometry, material );

			 mesh1.position.set( 0,-100, 0);
			mesh1.rotation.set(-(Math.PI / 2), 0, 0);
			mesh1.scale.set( 0.18, 0.18, 0.18 );


			mesh1.name = "Right_Femur_Bone";

			objects.push(mesh1);
			

			this.scene.add( mesh1 );
		});

		
	};

	//Setting up lights
	setupLights = () => {
		//Local variable declaration

		
	};	

	//Setting up raycaster
	setupRaycaster = () => {
		//Local variable declaration

		//Code
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
	};

	//Draw Geometries in scene
	draw = () => {
		//Local variable declaration
		const geometry_L1		=	new THREE.SphereGeometry( 1.5, 32, 32);
		const material_L1		=	new THREE.MeshBasicMaterial( {side:THREE.DoubleSide,color: "grey" } );

		const geometry_L2		=	new THREE.SphereGeometry( 1.5, 32, 32);
		const material_L2		=	new THREE.MeshBasicMaterial( { color: "grey" } );

		//LANDMARK-Fem Centre
		this.landmark_femurCentre		=	new THREE.Mesh(geometry_L1, material_L1);
		this.landmark_femurCentre.name	=	"FemurCentre";
		this.landmark_femurCentre.material.color.set('black');
		transformControl.attach(this.landmark_femurCentre);
		// let rBtn = document.getElementsByClassName("femCentre");

		// this.landmark_femurCentre.visible	=	false;
		this.landmark_femurCentre.position.set(-11.49667183472847, 29.702493960430466, 20.29713010148908);
		objects.push(this.landmark_femurCentre);
		this.scene.add(this.landmark_femurCentre);

		//LANDMARK-Hip Centre
		this.landmark_hipCenter		=	new THREE.Mesh(geometry_L2, material_L2);
		this.landmark_hipCenter.name	=	"HipCentre";
		this.landmark_hipCenter.position.set(-14.586308904469398, 104.37238282070668, 23.174603530337727);
		objects.push(this.landmark_hipCenter);
		this.scene.add(this.landmark_hipCenter);

		
	};

	//Start Animation
	start = () => {
		//Local variable declaration

		//Code
		//if already initalized then leave it be
		if(!this.frameId) {
			this.frameId = requestAnimationFrame(this.update);
		}
	};

	//Stop render loop
	stop = () => {
		//Local variable declaration

		//Code
		cancelAnimationFrame(this.frameId);
	};

	//Resize
	resizeWindow = (event) => {
		//Local variable declaration
		const container = this.renderer.domElement.parentNode;

		//Code
		if( container ) {
			const width = container.offsetWidth;
			const height = container.offsetHeight;
	
			this.renderer.setSize( width, height );
	
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
		}
	};

	//Game-loop
	update = () => {
		//Local variable declaration

		//Code
		orbitControls.update();
		this.renderScene();

		this.frameId = window.requestAnimationFrame(this.update);
	};

	//Handle onClick Femur button
	handleFemCentre = (event) => {
		//Local variable declaration

		//Code
		this.landmark_femurCentre.visible	=	true;
		this.landmark_femurCentre.material.color.set('black');
		
		transformControl.attach(this.landmark_femurCentre);
		if (this.landmark_hipCenter.visible === true) {
			this.landmark_femurCentre.material.color.set('black');
			this.landmark_hipCenter.material.color.set('darkgrey');
		}
	};

	//Handle onClick Hip button
	handleHipCentre = () => {
		//Local variable declaration

		//Code
		this.landmark_hipCenter.visible	=	true;
		this.landmark_hipCenter.material.color.set('black');

		transformControl.attach(this.landmark_hipCenter);

		if (this.landmark_femurCentre.visible === true) {
			this.landmark_femurCentre.material.color.set('darkgrey');
			this.landmark_hipCenter.material.color.set('black');
		}
	};

	//Handle onClick Update button
	handleUpdateBtn = () => {
		//Local variable declaration
		let geometryLine, materialLine;
		let geometryPlane, materialPlane;
		let geometryPlane2, materialPlane2;

		//Code
		console.log("Check : ", line);
		if (line != null) {
			line.visible		=	false;
			plane.visible		=	false;
			plane_2.visible	=	false;
		}

		this.landmark_femurCentre.visible	=	true;
		this.landmark_hipCenter.visible	=	true;
		this.landmark_femurCentre.material.color.set('black');
		this.landmark_hipCenter.material.color.set('black');

		transformControl.detach(this.landmark_femurCentre);
		transformControl.detach(this.landmark_hipCenter);

		this.points.push(this.landmark_femurCentre.position);
		this.points.push(this.landmark_hipCenter.position);

		geometryLine	=	new THREE.BufferGeometry().setFromPoints( this.points );
		materialLine	=	new THREE.LineBasicMaterial( { color: 0x0000ff } );

		line			=	new THREE.Line( geometryLine, materialLine );
		line.visible	=	true;
		this.scene.add(line);

		geometryPlane	=	new THREE.PlaneGeometry( 50, 50 );
		materialPlane =	new THREE.MeshBasicMaterial( {color: 'grey', side: THREE.DoubleSide} );

		plane = new THREE.Mesh( geometryPlane, materialPlane );
		plane.position.x	=	this.points[1].x;
		plane.position.y	=	this.points[1].y;
		plane.position.z	=	this.points[1].z;

		// plane.position.x	=	(this.points[1].x + this.points[0].x) / test;
		// plane.position.y	=	(this.points[1].y + this.points[0].y) / test;
		// plane.position.z	=	(this.points[1].z + this.points[0].z) / test;

		plane.visible	=	true;
		plane.lookAt(this.points[0]);
		this.scene.add( plane );

		geometryPlane2	= new THREE.PlaneGeometry( 50, 50 );
		materialPlane2	= new THREE.MeshBasicMaterial( {color: 'darkgrey', side: THREE.DoubleSide} );

		plane_2 = new THREE.Mesh( geometryPlane2, materialPlane2 );
		plane_2.position.x	=	(this.points[1].x);
		plane_2.position.y	=	(this.points[1].y);
		plane_2.position.z	=	(this.points[1].z);

		plane_2.translateOnAxis(new THREE.Vector3(0, 2, 0), 1.5);

		plane_2.visible  = true;
		plane_2.lookAt(this.points[0]);
		this.scene.add(plane_2);
	};

	//Handle onPointer event
	onPointerMove = (event) => {
		//Local variable declaration

		//Code
		this.pointer.x	=	(event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y	=	-(event.clientY / window.innerHeight) * 2 + 1;

		// update the picking ray with the camera and pointer position
		this.raycaster.setFromCamera(this.pointer, this.camera);

		// calculate objects intersecting the picking ray
		const intersects	=	this.raycaster.intersectObjects(objects	,true);

		if(intersects.length > 0 ){
			// console.log("Ray : ", intersects[0].object.name);
			if (intersects[0].object?.name === "FemurCentre") {
				this.handleFemCentre();
			}
			else if (intersects[0].object?.name === "HipCentre") {
				this.handleHipCentre();
			}
		}
		else{
			// 	transformControl.detach(this.landmark_femurCentre);
			// 	transformControl.detach(this.landmark_hipCenter);
		}
	};

	//Handle onClick Show/Hide button
	handleShowBtn = () => {
		//Local variable declaration

		//Code
		if (this.state.showClipping === true) {
			if(plane){
				var globalPlane	=	new THREE.Plane( new THREE.Vector3( 0, 1,0 ), this.distanceVector((new THREE.Vector3(0,0,0)),(this.landmark_hipCenter.position)));
				this.renderer.clippingPlanes = [ globalPlane ];
			}
		}
		else{
			this.renderer.clippingPlanes.pop();
		}
	};

	renderScene = () => {
		//Local variable declaration

		//Code
		let { renderer, scene, camera, } = this;
		if(renderer) {
			renderer.render(scene, camera);
		}
	};

	//Function to calculate distance between two 3D points
	distanceVector = ( v1, v2 )=>{
		//Local variable declaration

		//Code
		v1	=	new THREE.Vector3(0,0,0);
		var dx	=	v1.x - v2.x;
		var dy	=	v1.y - v2.y;
		var dz	=	v1.z - v2.z;

		return Math.sqrt( dx * dx + dy * dy + dz * dz );
	};

	render() {
		return (
			<div className='mainDiv'>
				{/* Canvas */}
				<div className="canvasContainer" >
					<div ref={ref => (this.mount = ref)}
						className="canvasContainer__maincanvas"
						id='mainC'
						style={{height:"100vh"}}/>
				</div>

				{/* Menu */}
				<div className="leftDiv">

					{/* Header */}
					<h1 id="mainlabel">STL File Viewer</h1>
					
					{/* Radio Buttons */}
					<div className='radioOpt'>
						<input
							type="radio"
							id="femCentre_id"
							name="fav_language"
							className="femCentre"
							value="femCentre"
							style={{height:"14px", width:"14px", cursor: "pointer"}}
							onChange={()=>{}}
							onClick={()=> {
								this.handleFemCentre();
						}}/>

						{/* Label */}
						<label><b>Femur Centre</b></label><br></br>
					</div>
			
					{/* Radio Buttons */}
					<div className='radioOpt'>
						<input
							type="radio"
							id="hipCentre_id"
							name="fav_language"
							className="hipCentre"
							value="hip"
							style={{height:"14px", width:"14px", cursor: "pointer"}}
							onClick={()=> {
								this.handleHipCentre();
						}}/>

						{/* Label */}
						<label><b>Hip Centre</b></label><br></br>
					</div>

					{/* Button Containers */}
					<div className='btn_container'>

						{/* Update Button */}
						<button id="update_btn_id"
							className="update_btn btn"
							style={{cursor: "pointer"}}
							onClick={()=> {
								this.handleUpdateBtn();
							}}>
							Update	
						</button>

						{/* Show / Hide Button */}
						<button className="show_btn btn"
						style={{cursor: "pointer"}}
						onClick={()=> {
							this.setState({
								showClipping : !this.state.showClipping
							})
							this.handleShowBtn();
						}}>
						Show / Hide</button>
					</div> 
				</div>
			</div>
		)
	};
}

export default CanvasHome;