import React, { Component } from 'react';
import * as THREE from "three";

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

var	orbitControls;
var	transformControl;

var	objects = [];
var	line;
var plane;

var mesh1,mesh2;

class CanvasHome extends Component {
	//Code
	constructor(props) {
		super(props);
		this.scene		=	null;
		this.camera		=	null;
		this.renderer	=	null;
		this.light		=	null;
		this.frameId	=	null;

		//Variables
		this.Right_FemurModel	=	null;
		this.Right_TibiaModel	=	null;
		
		this.mesh = null;

		this.points			=	[];
		this.points1 		=   [];
		this.points2 		=   [];
		this.points3 		=   [];

		this.raycaster		=	null;
		this.pointer		=	null;
		this.WNDSIZE		=	{ width:0, height: 0};

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

	//Initialization
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

		//Loading Model
		this.loadModel();

		//Light
		this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		this.scene.add(this.light);
		
		//Setting up raycaster for click event on Model
		this.setupRaycaster();

		//Draw Geomtries
		this.draw();

		//Draw scene / Game loop
		this.renderScene();

		//Start Animation
		this.start();

		//Window Events
		window.addEventListener('keydown', this.keyDown);
	
		window.addEventListener('click', this.onPointerClick);

		window.addEventListener("resize", this.resizeWindow, false);

		//Clear color
		this.renderer.setClearColor("white");
	};

	keyDown = (event) =>{
		//code
		switch(event.keyCode)
		{
			case 70:	//F or f
				// if(this[`landmarkMediallDistalPt`]){
				// 	console.log("-----x ",this[`landmarkMediallDistalPt`].position);
				// }
				break;
			default:
				break;
		}
	}
	
	//Setting up camera
	setupCamera = () => {
		//Code
		this.camera	 =	new THREE.PerspectiveCamera(75 , (this.WNDSIZE.width/this.WNDSIZE.height), 0.1, 1000);

		this.camera.position.set(
			-79.72404267414048, 
			66.6783789329992,
			180.89629390488778);

		this.camera.lookAt(this.scene.position);

		orbitControls	=	new OrbitControls(this.camera, this.renderer.domElement);

		transformControl	=	new TransformControls(this.camera, this.renderer.domElement);
		transformControl.setMode('translate');

		transformControl.addEventListener('dragging-changed', function (event) {
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

	//Setting up raycaster
	setupRaycaster = () => {
		//Code
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();
	};

	//Draw Geometries in scene
	draw = () => {
		
		//Drawing Landmarks
		this.landMarks();

		
	};

	landMarks = () =>{

		//LANDMARK-Fem Centre
		this.drawLandMark(new THREE.Vector3(-11.49667183472847, 29.702493960430466, 20.29713010148908), "FemurCentre");
	
		//LANDMARK-Hip Centre
		this.drawLandMark(new THREE.Vector3(-14.586308904469398, 104.37238282070668, 23.174603530337727), "HipCentre");

		//LANDMARK-Lateral Epicondyle
		this.drawLandMark(new THREE.Vector3(-17.24426874048524, 33.839616587639775, 17.65649309695238), "LateralEpicondyle");

		//LANDMARK-Medial Epicondyle
		this.drawLandMark(new THREE.Vector3(-3.5751411752251343, 32.01034502005889, 12.954036230043911), "MedialEpicondyle");

		//LANDMARK-Posterior Medial Pt
		this.drawLandMark(new THREE.Vector3(-6.370677656207347, 32.01034502005889, 10.304979442684118), "PosteriorMedialPt");

		//LANDMARK-Posterior Lateral Pt
		this.drawLandMark(new THREE.Vector3(-15.282235830750064, 32.01034502005889, 11.511216939842575), "PosteriorLateralPt");
		
		//LANDMARK-Lateral Distal Pt
		this.drawLandMark(new THREE.Vector3(-15.201401147767825, 35.19830120693245, 13.456837124008773), "LateralDistalPt");

		//LANDMARK- Mediall Distal Pt
		this.drawLandMark(new THREE.Vector3(-6.370919317447736, 34.5880007282575, 12.328991427522338), "MediallDistalPt");

	}

	//Draw LandMark
	drawLandMark = (position, name) =>{

		//Sphere Geometry For Landmark
		const geometry	= new THREE.SphereGeometry( 1.0, 32, 32);
		this.mesh		= new THREE.Mesh(geometry ,new THREE.MeshBasicMaterial( { color: "grey" } ));

		//Setting the position using parameter
		this.mesh.position.copy(position);
		this.mesh.name = name;

		//Setting the mesh name for particular landmark
		this[`landmark${name}`] = this.mesh;

		//Pushing into object array for raycaster
		objects.push(this[`landmark${name}`]);

		//Adding into the scene
		this.scene.add(this[`landmark${name}`]);
		this[`landmark${name}`].visible = false;

	}

	//Start Animation
	start = () => {
		//if already initalized then leave it be
		if(!this.frameId) {
			this.frameId = requestAnimationFrame(this.update);
		}
	};

	//Stop render loop
	stop = () => {
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
		//Code
		orbitControls.update();
		this.renderScene();

		this.frameId = window.requestAnimationFrame(this.update);
	};

	//Creation of landmark on clicking redio button
	handleClickOnRadio = (event,name) =>{

		//code
		console.log("---------------",this[`landmark${name}`].name);

		//FemurCenter
		if(name === "FemurCentre"){
			
			this.drawLandMark(new THREE.Vector3(-11.49667183472847, 29.702493960430466, 20.29713010148908), "FemurCentre");

			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].material.color.set("black");
			this[`landmark${name}`].visible = true;

			this[`landmarkHipCentre`].material.color.set("grey");
			this[`landmarkLateralEpicondyle`].material.color.set("grey");
			this[`landmarkMedialEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorMedialPt`].material.color.set("grey");
			this[`landmarkPosteriorLateralPt`].material.color.set("grey");
			this[`landmarkLateralDistalPt`].material.color.set("grey");
			this[`landmarkMediallDistalPt`].material.color.set("grey");


		}

		//HipCentre
		else if(name === "HipCentre"){

			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].material.color.set("black");
			this[`landmark${name}`].visible = true;

			this[`landmarkFemurCentre`].material.color.set("grey");
			this[`landmarkLateralEpicondyle`].material.color.set("grey");
			this[`landmarkMedialEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorMedialPt`].material.color.set("grey");
			this[`landmarkPosteriorLateralPt`].material.color.set("grey");
			this[`landmarkLateralDistalPt`].material.color.set("grey");
			this[`landmarkMediallDistalPt`].material.color.set("grey");


		}

		//LateralEpicondyle
		else if(name === "LateralEpicondyle"){
			
			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].material.color.set("black");
			this[`landmark${name}`].visible = true;

			this[`landmarkFemurCentre`].material.color.set("grey");
			this[`landmarkHipCentre`].material.color.set("grey");
			this[`landmarkMedialEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorMedialPt`].material.color.set("grey");
			this[`landmarkPosteriorLateralPt`].material.color.set("grey");
			this[`landmarkLateralDistalPt`].material.color.set("grey");
			this[`landmarkMediallDistalPt`].material.color.set("grey");



		}

		//MedialEpicondyle
		else if(name === "MedialEpicondyle"){
			
			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].visible = true;

			this[`landmark${name}`].material.color.set("black");

			this[`landmarkFemurCentre`].material.color.set("grey");
			this[`landmarkHipCentre`].material.color.set("grey");
			this[`landmarkLateralEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorMedialPt`].material.color.set("grey");
			this[`landmarkPosteriorLateralPt`].material.color.set("grey");
			this[`landmarkLateralDistalPt`].material.color.set("grey");
			this[`landmarkMediallDistalPt`].material.color.set("grey");

		}

		//PosteriorMedialPt
		else if(name === "PosteriorMedialPt"){
			
			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].visible = true;
			this[`landmark${name}`].material.color.set("black");

			this[`landmarkFemurCentre`].material.color.set("grey");
			this[`landmarkHipCentre`].material.color.set("grey");
			this[`landmarkLateralEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorLateralPt`].material.color.set("grey");
			this[`landmarkLateralDistalPt`].material.color.set("grey");
			this[`landmarkMediallDistalPt`].material.color.set("grey");

		}

		//PosteriorLateralPt
		else if(name === "PosteriorLateralPt"){
			
			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].visible = true;
			this[`landmark${name}`].material.color.set("black");

			this[`landmarkFemurCentre`].material.color.set("grey");
			this[`landmarkHipCentre`].material.color.set("grey");
			this[`landmarkLateralEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorMedialPt`].material.color.set("grey");
			this[`landmarkLateralDistalPt`].material.color.set("grey");
			this[`landmarkMediallDistalPt`].material.color.set("grey");


		}
		
		//LateralDistalPt
		else if(name === "LateralDistalPt"){
			
			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].visible = true;
			this[`landmark${name}`].material.color.set("black");

			this[`landmarkFemurCentre`].material.color.set("grey");
			this[`landmarkHipCentre`].material.color.set("grey");
			this[`landmarkLateralEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorMedialPt`].material.color.set("grey");
			this[`landmarkPosteriorLateralPt`].material.color.set("grey");
			this[`landmarkMediallDistalPt`].material.color.set("grey");


		}

		//MediallDistalPt
		else if(name === "MediallDistalPt"){
			
			transformControl.attach(this[`landmark${name}`]);
			this[`landmark${name}`].visible = true;
			this[`landmark${name}`].material.color.set("black");

			this[`landmarkFemurCentre`].material.color.set("grey");
			this[`landmarkHipCentre`].material.color.set("grey");
			this[`landmarkLateralEpicondyle`].material.color.set("grey");
			this[`landmarkPosteriorMedialPt`].material.color.set("grey");
			this[`landmarkPosteriorLateralPt`].material.color.set("grey");
			this[`landmarkLateralDistalPt`].material.color.set("grey");


		}
	}

	//Handle onClick Update button
	handleUpdateBtn = () => {
		//Code
		console.log("Check : ", line);

		transformControl.detach(this[`landmarkFemurCentre`]);
		transformControl.detach(this[`landmarkHipCentre`]);

		this.points.push(this[`landmarkFemurCentre`].position);
		this.points.push(this[`landmarkHipCentre`].position);

		this.points1.push(this[`landmarkMedialEpicondyle`].position);
		this.points1.push(this[`landmarkLateralEpicondyle`].position);

		this.points2.push(this[`landmarkPosteriorMedialPt`].position);
		this.points2.push(this[`landmarkPosteriorLateralPt`].position);


		this.drawLine(this.points,"line1");
		this.drawLine(this.points1,"line2");
		this.drawLine(this.points2,"line3");


		let lineDir = new THREE.Vector3();
		lineDir.subVectors(this.points[1],this.points[0]).normalize();

		let planeGeo = new THREE.PlaneGeometry(20,20);

		let planeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
		plane = new THREE.Mesh(planeGeo, planeMat);

		plane.position.copy(this.points[0]);;
		plane.lookAt(this.points[1]);
		
		this.scene.add(plane);

		/**- For Cliping -**/
		const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), plane.position.y);

		mesh2.traverse((child) => {
			console.log("--=-=-=-==-----",child);
			if (child.isMesh) {
				child.material.clippingPlanes = [clippingPlane];
				child.material.clipIntersection = true;
				child.material.needsUpdate = true;
			  }
		  });
		
	};

	//Drawing Line
	drawLine = (pts,name) =>{
		//code
		let geometryLine, materialLine;

		geometryLine = new THREE.BufferGeometry().setFromPoints( pts );
		materialLine = new THREE.LineBasicMaterial( { 
										color: 0xff00ff, 
										linewidth: 20,
										side: THREE.DoubleSide, 
										depthWrite: true
									} );

		this[`${name}`] = new THREE.Line( geometryLine, materialLine );
		// line.visible	=	true;

		this.scene.add(this[`${name}`]);

	}

	//Handle onPointer event
	onPointerClick = (event) => {

		//Code
		this.pointer.x	=	(event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y	=	-(event.clientY / window.innerHeight) * 2 + 1;

		// update the picking ray with the camera and pointer position
		this.raycaster.setFromCamera(this.pointer, this.camera);

		// calculate objects intersecting the picking ray
		const intersects	=	this.raycaster.intersectObjects(objects	,true);

		if(intersects.length > 0 ){
			if (intersects[0].object?.name === "FemurCentre") {

				this.mesh.name = "FemurCentre";
				this.handleClickOnRadio(event,"FemurCentre");

			}
			else if (intersects[0].object?.name === "HipCentre") {

				this.mesh.name = "HipCentre";
				this.handleClickOnRadio(event,"HipCentre");
			}
			else if (intersects[0].object?.name === "LateralEpicondyle") {

				this.mesh.name = "LateralEpicondyle";
				this.handleClickOnRadio(event,"LateralEpicondyle");

			}
			else if (intersects[0].object?.name === "MedialEpicondyle") {

				this.mesh.name = "MedialEpicondyle";
				this.handleClickOnRadio(event,"MedialEpicondyle");

			}

			else if (intersects[0].object?.name === "PosteriorMedialPt") {

				this.mesh.name = "PosteriorMedialPt";
				this.handleClickOnRadio(event,"PosteriorMedialPt");

			}

			else if (intersects[0].object?.name === "PosteriorLateralPt") {

				this.mesh.name = "PosteriorLateralPt";
				this.handleClickOnRadio(event,"PosteriorLateralPt");

			}

			else if (intersects[0].object?.name === "LateralDistalPt") {

				this.mesh.name = "LateralDistalPt";
				this.handleClickOnRadio(event,"LateralDistalPt");

			}

			else if (intersects[0].object?.name === "MediallDistalPt") {

				this.mesh.name = "MediallDistalPt";
				this.handleClickOnRadio(event,"MediallDistalPt");

			}
		}
		else{
			// transformControl.detach(this.mesh);
		}
	};

	//Handle Reset
	handleReset = () =>{
		//Code
		this[`landmarkHipCentre`].visible = false;
		this[`landmarkLateralEpicondyle`].visible = false;
		this[`landmarkMedialEpicondyle`].visible = false;
		this[`landmarkPosteriorMedialPt`].visible = false;
		this[`landmarkPosteriorLateralPt`].visible = false;
		this[`landmarkLateralDistalPt`].visible = false;
		this[`landmarkMediallDistalPt`].visible = false;
		this[`landmarkFemurCentre`].visible = false;

		transformControl.detach(this.mesh);

		let Rbtn = document.getElementsByName("fav_language");

		for(let i = 0; i < Rbtn.length; i++){
			if(Rbtn[i].checked)
			{
				Rbtn[i].checked = false;
			}
		}
		if(this[`line1`] && this[`line2`] && this[`line3`]){
			this.scene.remove(this[`line1`] );
			this.scene.remove(this[`line2`] );
			this.scene.remove(this[`line3`] );
		}
		
		if(plane){
			this.scene.remove(plane);
		}
		
	}

	renderScene = () => {
		//Code
		let { renderer, scene, camera, } = this;
		if(renderer) {
			renderer.render(scene, camera);
		}
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
				{/* Control Pannel / Radio Buttons */}
				<div className="controlPannel">

					{/* Header */}
					<h1 className="title_head">Create Landmarks(Point)</h1>
					
					{/* Radio Button - Femur Center*/}
					<div className='radioOpt'>
						<input
							type="radio"
							id="femCentre_id"
							name="fav_language"
							className="femCentre"
							value="femCentre"
							style={{height:"14px", width:"14px", cursor: "pointer"}}
							onChange={()=>{}}
							onClick={(event)=> {
								this.handleClickOnRadio(event,"FemurCentre");
						}}/>

						{/* Label */}
						<label>Femur Centre</label>
					</div>
			
					{/* Radio Button - Hip Center*/}
					<div className='radioOpt'>
						<input
							type="radio"
							id="hipCentre_id"
							name="fav_language"
							className="hipCentre"
							value="hip"
							style={{height:"14px", width:"14px", cursor: "pointer"}}
							onClick={(event)=> {
								this.handleClickOnRadio(event,"HipCentre");
						}}/>

						{/* Label */}
						<label>Hip Centre</label>
					</div>

					{/* Radio Button - Femur Proximal Canal*/}
					<div className='radioOpt'>
						{/* <input
							type="radio"
							id="FemurProximalCanal_id"
							name="fav_language"
							className="FemurProximalCanal"
							value="FemurProximalCanal"
							style={{height:"14px", width:"14px", cursor: "pointer"}}
							onClick={(event)=> {
								this.handleClickOnRadio(event,"FemurProximalCanal");

						}}/> */}

						{/* Label */}
						{/* <label>Femur Proximal Canal</label> */}
					</div>

					{/* Radio Button - Femur Distal Canal*/}
					<div className='radioOpt'>
					{/* <input
						type="radio"
						id="FemurDistalCanal_id"
						name="fav_language"
						className="FemurDistalCanal"
						value="FemurDistalCanal"
						style={{height:"14px", width:"14px", cursor: "pointer"}}
						onClick={(event)=> {
							this.handleClickOnRadio(event,"FemurDistalCanal");
						}}/> */}

						{/* Label */}
						{/* <label>Femur Distal Canal</label> */}
					</div>

					{/* Radio Button - Medial Epicondyle*/}
					<div className='radioOpt'>
					<input
						type="radio"
						id="hipCentre_id"
						name="fav_language"
						className="hipCentre"
						value="hip"
						style={{height:"14px", width:"14px", cursor: "pointer"}}
						onClick={(event)=> {
							this.handleClickOnRadio(event,"MedialEpicondyle");
						}}/>

						{/* Label */}
						<label>Medial Epicondyle</label>
					</div>

					{/* Radio Button - Lateral Epicondyle*/}
					<div className='radioOpt'>
					<input
						type="radio"
						id="lateralEpicondyleID"
						name="fav_language"
						className="lateralEpicondyle"
						value="LateralEpicondyle"
						style={{height:"14px", width:"14px", cursor: "pointer"}}
						onClick={(event)=> {
							this.handleClickOnRadio(event,"LateralEpicondyle");
						}}/>

						{/* Label */}
						<label>Lateral Epicondyle</label>
					</div>

					{/* Radio Button - Distal Medial Pt*/}
					<div className='radioOpt'>
					<input
						type="radio"
						id="MediallDistalPtID"
						name="fav_language"
						className="MediallDistalPt"
						value="MediallDistalPt"
						style={{height:"14px", width:"14px", cursor: "pointer"}}
						onClick={(event)=> {
							this.handleClickOnRadio(event,"MediallDistalPt");

						}}/>

						{/* Label */}
						<label>Distal Medial Pt</label>
					</div>

					{/* Radio Button - Distal Lateral Pt*/}
					<div className='radioOpt'>
					<input
						type="radio"
						id="LateralDistalPtID"
						name="fav_language"
						className="LateralDistalPt"
						value="LateralDistalPt"
						style={{height:"14px", width:"14px", cursor: "pointer"}}
						onClick={(event)=> {
							this.handleClickOnRadio(event,"LateralDistalPt");

						}}/>

						{/* Label */}
						<label>Distal Lateral Pt</label>
					</div>

					{/* Radio Button - Posterior Medial Pt*/}
					<div className='radioOpt'>
					<input
						type="radio"
						id="PosteriorMedialPtID"
						name="fav_language"
						className="PosteriorMedialPt"
						value="PosteriorMedialPt"
						style={{height:"14px", width:"14px", cursor: "pointer"}}
						onClick={(event)=> {
							this.handleClickOnRadio(event,"PosteriorMedialPt");
						}}/>

						{/* Label */}
						<label>Posterior Medial Pt</label>
					</div>

					{/* Radio Button - Posterior Lateral Pt*/}
					<div className='radioOpt'>
					<input
						type="radio"
						id="PosteriorLateralPtID"
						name="fav_language"
						className="PosteriorLateralPt"
						value="PosteriorLateralPt"
						style={{height:"14px", width:"14px", cursor: "pointer"}}
						onClick={(event)=> {
							this.handleClickOnRadio(event,"PosteriorLateralPt");
						}}/>

						{/* Label */}
						<label>Posterior Lateral Pt</label>
					</div>

					{/* Button Container */}
					<div className='btn_container'>

						{/* Update Button */}
						<button
							className="button update_btn btn"
							style={{cursor: "pointer"}}
							onClick={()=> {
								this.handleUpdateBtn();
							}}>
							Update	
						</button>

						{/* Reset Button */}
						<button 
							className="button show_btn btn"
							style={{cursor: "pointer"}}
							onClick={()=> {
								this.handleReset();
							}}>
							Reset</button>
					</div> 
				</div>
			</div>
		)
	};
}

export default CanvasHome;